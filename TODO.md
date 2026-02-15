## TODO
- [ ] Custom help page
- [x] Handle errors gracefully, and customize the default AnnotateError to contain fields like `message`, and `hint`. 
- [x] Error handling also needs to be more helpful to the user, and should not just print the error message, but also provide a hint on how to fix it.
  - [x] This means include stuff like folder names, paths, and other relevant information in the error message.
- [x] Should exit on q and ctrl+c gracefully.
  - [ ] Print a goodbye message on exit.
- [ ] Add a quote/callout component
- [ ] Open error.log with e, and open file with o using the user's default editor (when in watch mode).
- [ ] Add a simple test pdf in examples/
- [ ] error ui sucks fix it

### Annotation
- [ ] Should have a default style.sty file generated at the project root, with some default macros and packages.
- [ ] Tectonic
- [ ] PdfLatex
- [ ] XeLatex 
- [ ] Latexmk
- [ ] Typst
