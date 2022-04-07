const mongoCollections = require('../../config/mongoCollections');
const users = mongoCollections.users;
let { ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 16;

module.exports = {
    async createUser(email, password){
        if (!email || !password)  
        throw 'All fields need to have valid values';
        if (!password.trim()) {
          throw "Username and password cannot be empty"
        }
        if (password.indexOf(' ') >= 0) {
          throw "Password cannot contain spaces"
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
          throw "Email must be valid"
        }
        const usersCollection = await users();
        const res = await usersCollection.findOne({ email: email.toLowerCase() });
        if (res != null) throw "User with this email already exists";
        const hashPasswd = await bcrypt.hash(password, saltRounds);
        let newUser = {
            email:email,
            password: hashPasswd,
            reviewsGiven : [],
            role : "user"
        };
        const insertInfo = await usersCollection.insertOne(newUser);
          if (insertInfo.insertedCount === 0) throw 'Internal Server Error';
        else{
          const id = insertInfo.insertedId.toString()
          return {userInserted: true, userId: id , email : email};
        }
      },

    
      async checkUser(email, password){
        let compareToMatch = false;
        if (!email || !password) 
        throw 'All fields need to have valid values';
        if (!email.trim() || !password.trim()) {
          throw "Username and password cannot be empty"
        }
        const usersCollection = await users();
        const res = await usersCollection.findOne({ email: email.toLowerCase() });
        if (res === null) throw "Either the email or password is invalid";
        compareToMatch = await bcrypt.compare(password, res.password);
        if(compareToMatch){
          return {authenticated: true,role : res.role};
        }else{
          throw "Either the email or password is invalid";
        }
      },

      async getUserDetails(email){
        const usersCollection = await users()
        const user = await usersCollection.findOne({ email: email.toLowerCase() });
        if (user === null) {throw "No user with that email"}
        return user
      },
};