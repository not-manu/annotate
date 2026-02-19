## TODO
- [ ] Custom help page
- [x] Handle errors gracefully, and customize the default AnnotateError to contain fields like `message`, and `hint`. 
- [x] Error handling also needs to be more helpful to the user, and should not just print the error message, but also provide a hint on how to fix it.
  - [x] This means include stuff like folder names, paths, and other relevant information in the error message.
- [x] Should exit on q and ctrl+c gracefully.
- [ ] Add a quote/callout component
- [ ] Open error.log with e, and open file with o using the user's default editor (when in watch mode).
- [ ] Add a simple test pdf in examples/
- [ ] error ui sucks fix it
- [ ] also improve the error messages themselves, and make them more helpful to the user.
- [ ] add templates for Typst
- [ ] display a nice message when the project is created successfully
- [x] if we watch a .pdf it should auto redirect to the project folder and watch that.
- [x] if we create a project in a folder that already has a pdf, we should automatically start watching that pdf.
- [ ] generate images in img/ for each page.

### Annotation
- [x] Should have a default style.sty file generated at the project root, with some default macros and packages.
  - [ ] for typst as well
- [x] the pages size for the overlay pdf should be exactly the same as the corresponding page in the original pdf.
  - [ ] for typst as well
- [x] Tectonic
- [ ] PdfLatex
- [ ] XeLatex 
- [ ] Latexmk
- [ ] Typst

