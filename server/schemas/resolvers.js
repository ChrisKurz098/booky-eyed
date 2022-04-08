const { AuthenticationError } = require('apollo-server-express');
const { Book, User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

    Query: {
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



        saveBook: async (parent, { bookId }, context) => {
            if (context.user) {
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookId } },
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
                    { $pull: { savedBooks: { bookId: bookId } } },
                    { new: true }
                );
                return (updatedUser);
            }
            throw new AuthenticationError('Not Logged In!');
        }
    }
};



module.exports = resolvers;