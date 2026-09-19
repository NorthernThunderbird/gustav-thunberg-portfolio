# Exploration carousel assets

The carousel in `genie-trust-wrapper.html` ("Early exploration of …") reads its
slides from here. Until the files exist, each slide removes itself and the
carousel removes itself with them, so nothing broken ever renders.

A slide takes any one of three forms.

## Looping clip (preferred)

    <div class="gx-slide-frame">
      <video src="material/explorations/top-picks.mp4" muted loop playsinline …>
    </div>

Plays only while the slide is on screen, and stays paused under
`prefers-reduced-motion`. This is the right format for a long PNG sequence: a
few hundred frames is hundreds of megabytes as PNGs and a couple of megabytes
as H.264, and the browser decodes it in hardware.

## Looping frame sequence

    top-picks/frames.json   ["001.png", "002.png", …]  frame filenames, in order
    top-picks/001.png …

Any filenames work — `frames.json` is the order of play. Loops at ~12fps, starts
when the slide scrolls into view, holds on frame one under reduced motion. Only
worth it for short sequences; every frame is a separate request.

To regenerate a manifest after dropping frames in:

    python3 -c "import json,os,sys; d=sys.argv[1]; json.dump(sorted(f for f in os.listdir(d) if f.lower().endswith('.png')), open(d+'/frames.json','w'))" material/explorations/top-picks

## Single image

    recaps-old.png
