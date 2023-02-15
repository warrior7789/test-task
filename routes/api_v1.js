const auth = require("../middleware/auth");
var UsersController = require("../controllers/api/v1/UsersController");

app.group("/api/v1", (router) => {
    router.post("/sign-up", UsersController.Signup);
    router.post("/login", UsersController.Login);

    router.post("/my-account", auth, UsersController.MyAccount);
    router.post("/add-task", auth, UsersController.AddTask);
    router.patch("/update-task/:task_id", auth, UsersController.UpdateTask);
    router.get("/list-task", auth, UsersController.ListTask);
    router.delete("/delete-task/:task_id", auth, UsersController.DeleteTask);
    router.post("/sort-task", auth, UsersController.SortTask);
});
