const splitPDF = ({ filePaths, dirPath, pdf, path }) => {
  const pageFilePaths = [];
  filePaths.forEach((fp) => {
    const pdfReader = pdf.createReader(fp);
    const pagesCount = pdfReader.getPagesCount();
    const { name } = path.parse(fp);
    for (let i = 0; i < pagesCount; i += 1) {
      const pageFilePath = path.join(dirPath, `${name}-page-${i + 1}.pdf`);
      const pdfWriter = pdf.createWriter(pageFilePath);
      const copyContext = pdfWriter.createPDFCopyingContext(pdfReader);
      copyContext.appendPDFPageFromPDF(i);
      pdfWriter.end();
      pageFilePaths.push(pageFilePath);
    }
  });
  return pageFilePaths;
};

window.PLUGIN = {
  handleFiles: async ({
    inputs,
    context,
    system: { path },
  }) => {
    const { filePaths } = inputs;
    const {
      log,
      notify,
      openDialog,
      openOutputFolder,
      pdf,
    } = context;

    if (filePaths) {
      const dirPath = await openDialog({
        options: {
          title: 'Select save directory for splitted PDFs',
        },
        properties: ['openDirectory'],
      });
      const pageFilePaths = splitPDF({
        filePaths,
        dirPath,
        pdf,
        path,
      });
      notify(`PDF file${filePaths > 1 ? 's' : ''} splitted.`);
      log({
        action: `Splitted PDF file${filePaths > 1 ? 's' : ''} to pages`,
        meta: {
          type: 'text',
          value: pageFilePaths.join(';'),
        },
      });
      await openOutputFolder(dirPath);
    }
  },
};
