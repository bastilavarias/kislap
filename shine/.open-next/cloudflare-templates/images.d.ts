export type RemotePattern = {
    protocol?: "http" | "https";
    hostname: string;
    port?: string;
    pathname: string;
    search?: string;
};
export type LocalPattern = {
    pathname: string;
    search?: string;
};
/**
 * Handles requests to /_next/image(/), including image optimizations.
 *
 * Image optimization is disabled and the original image is returned if `env.IMAGES` is undefined.
 *
 * Throws an exception on unexpected errors.
 *
 * @param requestURL
 * @param requestHeaders
 * @param env
 * @returns A promise that resolves to the resolved request.
 */
export declare function handleImageRequest(requestURL: URL, requestHeaders: Headers, env: CloudflareEnv): Promise<Response>;
export type OptimizedImageFormat = "image/avif" | "image/webp";
export declare function matchLocalPattern(pattern: LocalPattern, url: {
    pathname: string;
    search: string;
}): boolean;
export declare function matchRemotePattern(pattern: RemotePattern, url: URL): boolean;
type ImageContentType = "image/avif" | "image/webp" | "image/png" | "image/jpeg" | "image/jxl" | "image/jp2" | "image/heic" | "image/gif" | "image/svg+xml" | "image/x-icon" | "image/x-icns" | "image/tiff" | "image/bmp";
/**
 * Detects the content type by looking at the first few bytes of a file
 *
 * Based on https://github.com/vercel/next.js/blob/72c9635/packages/next/src/server/image-optimizer.ts#L155
 *
 * @param buffer The image bytes
 * @returns a content type of undefined for unsupported content
 */
export declare function detectImageContentType(buffer: Uint8Array): ImageContentType | null;
declare global {
    var __IMAGES_REMOTE_PATTERNS__: RemotePattern[];
    var __IMAGES_LOCAL_PATTERNS__: LocalPattern[];
    var __IMAGES_DEVICE_SIZES__: number[];
    var __IMAGES_IMAGE_SIZES__: number[];
    var __IMAGES_QUALITIES__: number[];
    var __IMAGES_FORMATS__: NextConfigImageFormat[];
    var __IMAGES_MINIMUM_CACHE_TTL_SEC__: number;
    var __IMAGES_ALLOW_SVG__: boolean;
    var __IMAGES_CONTENT_SECURITY_POLICY__: string;
    var __IMAGES_CONTENT_DISPOSITION__: string;
    var __IMAGES_MAX_REDIRECTS__: number;
    type NextConfigImageFormat = "image/avif" | "image/webp";
}
export {};
