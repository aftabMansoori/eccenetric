export interface IStorageProvider {
  /**
   * Generates a signed URL for direct client-side upload (V4)
   * @param key The unique identifier/path for the file in storage
   * @param contentType The MIME type of the file
   * @returns A promise that resolves to the signed upload URL
   */
  generateUploadUrl(key: string, contentType: string): Promise<string>;

  /**
   * Generates a signed URL for downloading/viewing the file
   * @param key The unique identifier/path for the file in storage
   * @returns A promise that resolves to the signed download URL
   */
  getDownloadUrl(key: string): Promise<string>;

  /**
   * Deletes a file from storage
   * @param key The unique identifier/path for the file in storage
   */
  deleteFile(key: string): Promise<void>;
}
