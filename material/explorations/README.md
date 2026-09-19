# Exploration carousel assets

The carousel in `genie-trust-wrapper.html` ("Early exploration of …") reads its
slides from here. All three assets are square (1:1), which is what
`.gx-slide-frame` sets its aspect ratio to.

    old-top-picks.mov   1080x1080 H.264, 3.4s, looping clip
    old-chat.mov        1080x1080 H.264, 10.0s, looping clip
    recaps-old.webp     1400x1400 with alpha

The clips are QuickTime containers carrying H.264, declared as `video/mp4` —
the same arrangement as the `.mov` files on `bookstore-ppb.html`. They play only
while their slide is on screen and stay paused under `prefers-reduced-motion`.

A slide whose asset fails to load removes itself, and if no slide survives the
carousel removes itself too, so a missing file never renders as a broken frame.
