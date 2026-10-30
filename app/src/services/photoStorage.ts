import { Directory, File, Paths } from 'expo-file-system';

const PHOTO_DIRECTORY_NAME = 'profile-photos';

function getPhotoDirectory(): Directory {
  return new Directory(Paths.document, PHOTO_DIRECTORY_NAME);
}

function getPhotoDirectoryUri(): string {
  const { uri } = getPhotoDirectory();
  return uri.endsWith('/') ? uri : `${uri}/`;
}

/** Indica se a URI pertence ao armazenamento administrado pelo aplicativo. */
export function isManagedPhoto(uri: string): boolean {
  return uri.startsWith(getPhotoDirectoryUri());
}

/**
 * Copia a imagem escolhida para o diretório de documentos do aplicativo,
 * que não é limpo pelo sistema, e devolve a URI do arquivo copiado.
 */
export async function storePhoto(sourceUri: string): Promise<string> {
  const directory = getPhotoDirectory();
  directory.create({ idempotent: true });

  const source = new File(sourceUri);
  const rawExtension = source.extension;
  const extension = rawExtension
    ? rawExtension.startsWith('.')
      ? rawExtension
      : `.${rawExtension}`
    : '.jpg';
  const destination = new File(directory, `photo-${Date.now()}${extension}`);

  await source.copy(destination);
  return destination.uri;
}

/** Remove uma foto, apenas se ela estiver no armazenamento do aplicativo. */
export function deletePhoto(uri: string): void {
  if (!isManagedPhoto(uri)) {
    return;
  }
  try {
    const file = new File(uri);
    if (file.exists) {
      file.delete();
    }
  } catch {
    // Limpeza é best-effort: um arquivo que não pôde ser removido não deve falhar a operação.
  }
}

/** Remove todas as fotos de perfil armazenadas pelo aplicativo. */
export function clearPhotos(): void {
  try {
    const directory = getPhotoDirectory();
    if (directory.exists) {
      directory.delete();
    }
  } catch {
    // Limpeza best-effort, como em deletePhoto.
  }
}
