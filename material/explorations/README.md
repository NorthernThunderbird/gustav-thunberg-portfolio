# Exploration carousel assets

The carousel in `genie-trust-wrapper.html` ("Early exploration of …") reads its
slides from here. Until the files exist, each slide removes itself and the
carousel removes itself with them, so nothing broken ever renders.

## Looping frame sequences

    top-picks/frames.json   ["001.png", "002.png", …]  frame filenames, in order
    top-picks/001.png …
    chat/frames.json
    chat/001.png …

Any filenames work — `frames.json` is the order of play. The sequence loops at
~12fps, starts only when the slide scrolls into view, and holds on the first
frame under `prefers-reduced-motion`.

To regenerate a manifest after dropping frames in:

    python3 -c "import json,os,sys; d=sys.argv[1]; json.dump(sorted(f for f in os.listdir(d) if f.lower().endswith('.png')), open(d+'/frames.json','w'))" material/explorations/top-picks

## Single image

    recaps-old.png
