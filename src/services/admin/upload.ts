import { createClient } from '@/lib/supabase/client';

export class UploadService {
  private supabase = createClient();

  async uploadImage(file: File, bucket: string = 'posts'): Promise<string | null> {
    try {
      // 파일명 생성 (timestamp + 원본파일명)
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      // 스토리지에 업로드
      const { data, error } = await this.supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return null;
      }

      // 공개 URL 가져오기
      const { data: { publicUrl } } = this.supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  }

  async deleteImage(url: string): Promise<boolean> {
    try {
      // URL에서 파일 경로 추출
      const urlParts = url.split('/storage/v1/object/public/images/');
      if (urlParts.length !== 2) return false;
      
      const filePath = urlParts[1];

      const { error } = await this.supabase.storage
        .from('images')
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }
}

export const uploadService = new UploadService();