# n8n + FFmpeg + fonts for the FREE Nature & Destination Shorts workflow
FROM n8nio/n8n:latest

USER root
# Static FFmpeg build (libx264, freetype/drawtext, AAC). Works even on n8n images without a package manager.
COPY --from=mwader/static-ffmpeg:7.1 /ffmpeg /ffprobe /usr/local/bin/
# Title font used by the render script (fallback: DejaVu Sans Bold)
ADD https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-SemiBold.ttf /usr/share/fonts/custom/Poppins-SemiBold.ttf
RUN chmod 755 /usr/share/fonts/custom && chmod 644 /usr/share/fonts/custom/*.ttf \
 && mkdir -p /home/node/.n8n-files/music /home/node/.n8n-files/shorts \
 && chown -R node:node /home/node/.n8n-files
USER node
