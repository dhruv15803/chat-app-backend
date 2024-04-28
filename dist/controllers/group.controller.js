import { Group } from "../models/Group.model.js";
import { User } from "../models/user.model.js";
const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body;
        if (groupName.trim() === "") {
            res.status(400).json({
                "success": false,
                "message": "Please enter a group name"
            });
            return;
        }
        // GROUP NAME SHOULD BE UNIQUE SO CHECKING IN DB
        const existingGroup = await Group.findOne({ groupName: groupName.trim().toLowerCase() });
        if (existingGroup) {
            res.status(400).json({
                "success": false,
                "message": "Group already exists",
            });
            return;
        }
        // the logged in user will be creating the group so initially when
        // creating the group , add the logged in user as a participant.
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        const newGroup = await Group.create({ groupName, participants: [user?._id], owner: user?._id });
        res.status(201).json({
            "success": true,
            "message": "successfully created group",
            newGroup,
        });
    }
    catch (error) {
        console.log(error);
    }
};
const getMyGroups = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findOne({ _id: userId });
        if (!user) {
            res.status(400).json({
                "success": false,
                "message": "userId not correct"
            });
            return;
        }
        const groups = await Group.find({ participants: { $all: [user._id] } });
        if (!groups) {
            res.json({
                "success": false,
                "message": "You have no groups"
            });
        }
        res.status(200).json({
            "success": true,
            groups,
        });
    }
    catch (error) {
        console.log(error);
    }
};
export { createGroup, getMyGroups, };
