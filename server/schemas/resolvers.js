const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
        // me: async (parent, args, context) => {
        //     if (context.user) {
        //         const userData = await User.findOne({ _id: context.user._id })
        //             .select('-__v -password')
        //         return userData;
        //     }
        //     throw new AuthenticationError('Not logged in');
        // },

        getSingleUser: async (parent, args, context) => {
            const foundUser = await User.findOne({
                $or: [{ _id: user ? user._id : context.user.id }, { username: username }],
            })
            .select('-__v -password')
            .populate('savedBooks')
            ;

            if (!foundUser) {
                throw new AuthenticationError('Cannot find a user with this id!');
            }

            return (foundUser);
        },
    },



    Mutation: {
        login: async (parent, { username, email, password }) => {
            {
                const user = await User.findOne({ $or: [{ username: username }, { email: email }] });
                if (!user) {
                    throw new AuthenticationError("Can't find this user");
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('Wrong password!');
                }
                const token = signToken(user);
                return ({ token, user });
            }
        },

       

        createUser: async (parent, args) => {
            const user = await User.create(args);

            if (!user) {
                throw new AuthenticationError('Something is wrong!');
            }
            const token = signToken(user);
            return ({ token, user });
        },


        saveBook: async (parent, {bookData} , context) => {
            console.log('----------------------ATTEMPT TO SAVE BOOK: ',bookData);

            if (context.user) {
                console.log(context.user);
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $push: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );
                return (updatedUser);
            }
            throw new AuthenticationError('Not Logged In!');
        },

        deleteBook: async (parent, { bookId, context }) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookData: bookData  } } },
                    { new: true }
                );
                return (updatedUser);
            }
            throw new AuthenticationError('Not Logged In!');
        }
    }
};



module.exports = resolvers;