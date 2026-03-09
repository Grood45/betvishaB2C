const ShortcutModel = require('../../models/shortcut.model');

const addShortcut = async (req, res) => {
    try {
        const { title, path, icon, status } = req.body;

        if (!title || !path) {
            return res.status(400).json({ message: "Title and path are required" });
        }

        const newShortcut = new ShortcutModel({ title, path, icon, status });
        await newShortcut.save();

        res.status(201).json({ message: "Shortcut created successfully", data: newShortcut });
    } catch (error) {
        res.status(500).json({ message: "Error creating shortcut", error: error.message });
    }
};

const getShortcuts = async (req, res) => {
    try {
        const shortcuts = await ShortcutModel.find().sort({ createdAt: -1 });
        res.status(200).json({ data: shortcuts });
    } catch (error) {
        res.status(500).json({ message: "Error fetching shortcuts", error: error.message });
    }
};

const updateShortcut = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, path, icon, status } = req.body;

        const updatedShortcut = await ShortcutModel.findByIdAndUpdate(
            id,
            { title, path, icon, status },
            { new: true }
        );

        if (!updatedShortcut) {
            return res.status(404).json({ message: "Shortcut not found" });
        }

        res.status(200).json({ message: "Shortcut updated successfully", data: updatedShortcut });
    } catch (error) {
        res.status(500).json({ message: "Error updating shortcut", error: error.message });
    }
};

const deleteShortcut = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedShortcut = await ShortcutModel.findByIdAndDelete(id);

        if (!deletedShortcut) {
            return res.status(404).json({ message: "Shortcut not found" });
        }

        res.status(200).json({ message: "Shortcut deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting shortcut", error: error.message });
    }
};

module.exports = {
    addShortcut,
    getShortcuts,
    updateShortcut,
    deleteShortcut
};
