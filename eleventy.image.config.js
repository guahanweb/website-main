const path = require("path");
const fs = require("fs");

const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const Image = require("@11ty/eleventy-img");
const Sharp = require("sharp");

const IMG_THUMB_WIDTH = 240;
const IMG_HERO_WIDTH = 920;
const IMG_HERO_HEIGHT = Math.round(IMG_HERO_WIDTH / 19 * 6);
const IMG_DEFAULT_WIDTH = 1200;

module.exports = function(eleventyConfig) {
    const sizeNames = ["thumb", "hero", "default"];
    let resizedList = {};

    eleventyConfig.on('eleventy.after', async ({ dir, results, runMode, outputMode }) => {
        // reset the resizedList to empty until the next build
        resizedList = {};
    });

    eleventyConfig.addAsyncShortcode('image', async function (src, alt = "", size = "default") {
        const dirPath = path.dirname(src);
        const imageFile = path.join(eleventyConfig.dir.input, src);
        const sizeIndex = sizeNames.indexOf(size);

        // short circuit if the referenced file does not exist
        if (!fs.existsSync(imageFile)) return Promise.reject(`Image source does not exist: ${imageFile}`);
        if (sizeIndex === -1) return Promise.reject(`Invalid image size provided, supported sizes: ${sizeNames.join(', ')}`);

        let metadata = resizedList && resizedList[src];
        if (!metadata) {
            // we nave not resized this image yet, so take care of it
            try {
                const resizedImageBuffer = await Promise.all([
                    resizeImage(src, IMG_THUMB_WIDTH, IMG_THUMB_WIDTH, 'fill'), // thumb
                    resizeImage(src, IMG_HERO_WIDTH, IMG_HERO_HEIGHT, 'cover'), // hero
                    resizeImage(src, IMG_DEFAULT_WIDTH, null, 'cover'), // default
                ]);

                metadata = await Promise.all(
                    resizedImageBuffer.map(async buffer => {
                        return await Image(buffer, {
                            formats: ["webp", "jpeg"],
                            outputDir: path.join(eleventyConfig.dir.output, dirPath),
                            urlPath: (dirPath[0] == '/') ? dirPath : `/${dirPath}`,
                        })
                    })
                );

                // be sure we track which we've processed to keep from building multiple times
                resizedList[src] = metadata;
            } catch (err) {
                console.error(err);
            }
        }

        // now, we have the metadata, so build the HTML
        const imageHTML =
`<picture>
    <img
        class=""
        alt="${alt}"
        loading="lazy"
        decoding="async"
        src="${ metadata[sizeIndex].webp[0].url }"
<\/picture>`

        this.page.images = resizedList;
        return imageHTML;
    });

    eleventyConfig.addFilter('ogimage', async (images, hero) => {
        const DEFAULT_URL = "/img/project-card-beach.jpg";

        // short circuit with defalut
        if (!images) return DEFAULT_URL;

        const imageUrls = Object.keys(images);
        if (!imageUrls.length) return DEFAULT_URL;

        let selectionIndex = 0;
        if (hero && hero.img) {
            selectionIndex = imageUrls.indexOf(hero.img);
            if (selectionIndex < 0) selectionIndex = 0;
        }

        // explicitly grab the original image
        const image = images[imageUrls[selectionIndex]];
        return image[2].jpeg[0].url;
    });
};

async function resizeImage(src, width, height, mode) {
    return await Sharp(src)
        .resize({ width, height, fit: mode })
        .toBuffer();
}
