import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import NoteModel from "../models/note";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        const notes = await NoteModel.find({ userId: authenticatedUserId }).exec();
        res.status(200).json(notes);
    } catch (error) {
        next(error);
    }
}

export const getNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Note ID is invalid!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note ID not found!");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "Sorry, you are restricted from accessing this note!");
        }

        res.status(200).json(note);
    }
    catch (error) {
        next(error);
    }
}

interface PostNoteBody {
    title?: string;
    content?: string;
}

export const postNote: RequestHandler<unknown, unknown, PostNoteBody, unknown> = async (req, res, next) => {
    const title = req.body.title;
    const content = req.body.content;
    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!title) {
            throw createHttpError(400, "Title is required for a Note!");
        }

        const createdNote = await NoteModel.create({
            userId: authenticatedUserId,
            title: title,
            content: content,
        });
        res.status(201).json(createdNote);
    } catch (error) {
        next(error);
    }
}

interface UpdateNoteParams {
    noteId: string;
}

interface UpdateNoteBody {
    title?: string;
    content?: string;
}

export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
    const noteId = req.params.noteId;
    const updatedTitle = req.body.title;
    const updatedContent = req.body.content;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Note ID is invalid!");
        }

        if (!updatedTitle) {
            throw createHttpError(400, "Title is required for a Note!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note ID not found!");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "Sorry, you are restricted from accessing this note!");
        }

        note.title = updatedTitle;
        note.content = updatedContent;

        const updatedNote = await note.save();

        res.status(200).json(updatedNote);
    } catch (error) {
        next(error);
    }
}

export const deleteNote: RequestHandler = async (req, res, next) => {
    const noteId = req.params.noteId;

    const authenticatedUserId = req.session.userId;

    try {
        assertIsDefined(authenticatedUserId);

        if (!mongoose.isValidObjectId(noteId)) {
            throw createHttpError(400, "Note ID is invalid!");
        }

        const note = await NoteModel.findById(noteId).exec();

        if (!note) {
            throw createHttpError(404, "Note ID not found!");
        }

        if (!note.userId.equals(authenticatedUserId)) {
            throw createHttpError(401, "Sorry, you are restricted from accessing this note!");
        }

        await note.deleteOne();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}
