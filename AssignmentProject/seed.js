var StatusENUMS = {
    ACTIVE : "ACTIVE",
    COMPLETE : "COMPLETE",
    DELETED : "DELETED"
};

var todos = {
    1 : {title : "Learn JavaScript", status : StatusENUMS.ACTIVE},
    2 : {title : "Git Tutorial", status : StatusENUMS.COMPLETE},
    3 : {title : "Express", status : StatusENUMS.DELETED},
    4 : {title : "Learn Node", status : StatusENUMS.ACTIVE},
    5 : {title : "GitHub Tutorial", status : StatusENUMS.COMPLETE},
    6 : {title : "Mongos", status : StatusENUMS.DELETED},
};

var next_todo_id = 7;

module.exports= {
    StatusENUMS  : StatusENUMS,
    todos : todos,
    next_todo_id :next_todo_id
};
