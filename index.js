import { PdfReader } from "pdfreader";
import fs from "fs";
const FOLDER_PATH = "./files";
const NAME_BOOK = "example";

async function canYouRead() {
  try {
    const book = {
      pages: ["empty page"],
    };
    let current_page = 0;
    let current_text = "";
    await new Promise((resolve, reject) => {
      new PdfReader({}).parseFileItems(
        `${FOLDER_PATH}/${NAME_BOOK}.pdf`,
        (err, item) => {
          if (err) {
            console.error("error:", err);
            reject();
          }
          if (!item) {
            // Adding the last page and then resolve
            book.pages[current_page] = current_text;
            // console.warn("end of file");
            resolve();
          } else if (
            item &&
            item.page != current_page &&
            item.page != undefined
          ) {
            book.pages[current_page] = current_text;
            current_page = item.page;
            current_text = '';
          } else if (item.text && item.text != undefined) {
            current_text += item.text;
          }
        },
      );
    });
    console.log(book.pages[5]);
    // createExtractedBook({ name_book: NAME_BOOK, book: book });
  } catch (error) {
    console.error("can't read the pdf", error);
  }
}

function createExtractedBook({ name_book, book }) {
  try {
    fs.writeFileSync(`./books/${name_book}.json`, JSON.stringify(book));
  } catch (error) {
    console.error("[ createExtractedBook | error ] => ", error);
  }
}

canYouRead();
