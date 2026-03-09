const express = require("express");
const { AddNewDocument, UpdateDocumentById, GetSingleDocumentById, GetAllDocuments, DeleteDocumentById } = require("../controllers/seocontroller/seo.controllers");
const OwnerAuthMiddleware = require("../middlewares/ownerauth.middleware");

const SeoRouter = express.Router();

SeoRouter.get("/get-all-seo", GetAllDocuments);
SeoRouter.get("/get-single-seo/:name", GetSingleDocumentById);
SeoRouter.patch("/update-single-seo/:id", UpdateDocumentById,OwnerAuthMiddleware);
SeoRouter.delete("/delete-single-seo/:id", DeleteDocumentById,OwnerAuthMiddleware);
SeoRouter.post("/add-seo", AddNewDocument,OwnerAuthMiddleware);

module.exports={SeoRouter}
