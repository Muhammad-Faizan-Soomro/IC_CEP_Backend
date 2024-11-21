import express from "express";
import mongoose from "mongoose";
import Task from "./task.model.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

const PORT = 5000;

// connect databae
mongoose
  .connect("mongodb://127.0.0.1/ic")
  .then(console.log("MongoDB connected successfully"));

// read all tasks
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      return res.status(500).json({
        success: false,
        message:
          "Some error occurred while retrieving the tasks, please try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully ",
      task: tasks,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error Occurred: ${error.message}` });
  }
});

// create a new task
app.post("/new-task", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter a valid task name." });
    }

    const task = await Task.create({ name });
    if (!task) {
      return res.status(400).json({
        success: false,
        message:
          "Some error occurred while creating the task, please try again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "task created successfully.",
      task: task,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error Occurred: ${error.message}` });
  }
});

// delete a task
app.delete("/delete-task/:id", async (req, res) => {
  try {
    const { id } = req.params || req.body;
    await Task.deleteOne({ _id: id });
    const task = await Task.findById(id);
    if (task) {
      return res.status(500).json({
        success: false,
        message:
          "some error occurred while deleting the task, please try again.",
      });
    }
    return res
      .status(200)
      .json({ success: true, message: "task deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error Occurred: ${error.message}` });
  }
});

// update a task
app.put("/update-task/:id", async (req, res) => {
  try {
    const { name, completed } = req.body;
    const { id } = req.params || req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "please enter a valid name" });
    }
    const updatedTask = await Task.updateOne(
      { _id: id },
      { name: name, completed: completed }
    );
    if (!updatedTask) {
      return res.status(500).json({
        success: false,
        message:
          "some error occurred while updating the task, please trya again.",
      });
    }
    return res.status(200).json({
      success: true,
      message: "task updated successfully",
      task: { name: name },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error Occurred: ${error.message}` });
  }
});

// start the server
app.listen(PORT, () => {
  console.log(`server successfully running on port=${PORT}`);
});
