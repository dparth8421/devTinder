const mongoose = require("mongoose");

const connectionRequestSchema = mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true
    },
    status:{
        type:String,
        required: true,
        enum:{
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} incorrect status type`
        }
        
    }
},{
    timestamps: true
})

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", async function (next) {
    // This middleware can be used to perform actions before saving the connection request
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to self.");
    }
    next();
})

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);


module.exports = ConnectionRequestModel