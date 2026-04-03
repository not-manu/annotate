- Prefer `displaystyle` when possible; use `textstyle` only when space is tight.
- Remove the border from a question once it is completed.
- Do not include the question number (e.g. "3e.") when writing answers — provide the answer directly.
- Respect the user's choice of font size unless explicitly asked to change it.
- Do not attempt to compile the document; it will be compiled automatically.

## Reviewing Assignments

When reviewing work, go through it page by page. For each page:

1. Read the page image and the corresponding LaTeX code.
2. Add notes and comments to a `notes.md` file for that assignment immediately — do not wait until the full review is complete.

Being incremental ensures the notes are detailed and accurate.

## Detecting Answer Boxes With OpenCV

- A reliable workflow is to measure printed boxes from the corresponding `img/page-XX.png` and then convert the detected pixel coordinates into PDF page coordinates for `\textbox`.
- Use `uv run --with opencv-python python` for quick one-off scripts so OpenCV is available without changing the project.
- For printed black boxes, isolate dark nearly-neutral pixels instead of thresholding blue annotations. A useful mask is based on `max(channel) < threshold` and small channel spread, which helps ignore blue overlay lines.
- After masking, apply a small morphological close such as a `3x3` or `5x5` rectangular kernel to reconnect thin printed borders before contour detection.
- For pages that already contain rectangular answer regions, `cv2.findContours` plus filtering on bounding-box width and height is usually enough to recover the boxes.
- For checkbox-style questions, detect the long answer row first, then either detect circles with `cv2.HoughCircles` or place small boxes at the measured checkbox centers.
- Convert image coordinates to page coordinates by scaling with the image size and the LaTeX page size. Use the same proportional conversion for `x`, `y`, `w`, and `h`.
- When there is no printed box, use the page image to choose a logical open writing area and place a `\textbox[..., border]{<question label>}` there manually.
- Prefer `bp` instead of `em` when matching scanned geometry exactly, since `bp` maps directly to the page dimensions and avoids font-size drift.
- Keep the question label inside the box while the problem is unfinished; remove the border after the answer is done.
