const mongoose = require('mongoose');
const User = require('../models/User');

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://admin:admin@cluster0.olllj.mongodb.net/");
        console.log('✅ Connected to MongoDB');

        const adminCount = await User.countDocuments({ role: 'admin' });
        if (adminCount < 3) {
            const admins = [
                { username: 'Admin@pakhumanitarainform', password: 'AdminPak', role: 'admin' },
                { username: 'Maqbool@pakhumanitarainform', password: 'MaqboolPak', role: 'admin' },
                { username: 'Shahid@pakhumanitarainform', password: 'ShahidPak', role: 'admin' }
            ];

            await User.insertMany(admins);
            console.log('✅ Admin users created');
        } else {
            console.log('✅ Admin users already exist');
        }

        // New user list
        const users = [
            { username: 'AAR Japan', password: 'password' },
            { username: 'ACTED', password: 'password' },
            { username: 'Action Against Hunger', password: 'password' },
            { username: 'Action For Humanity (AFH)', password: 'password' },
            { username: 'Aga Khan Agency for Habitat (AKAH)', password: 'password' },
            { username: 'Alight', password: 'password' },
            { username: 'CARE International in Pakistan (CIP)', password: 'password' },
            { username: 'CBM', password: 'password' },
            { username: 'CESVI', password: 'password' },
            { username: 'Concern Worldwide', password: 'password' },
            { username: 'Catholic Relief Services (CRS)', password: 'password' },
            { username: 'Diakonie Katastrophenhilfe (DKH)', password: 'password' },
            { username: 'Handicap International', password: 'password' },
            { username: 'HelpAge International', password: 'password' },
            { username: 'Helping Hand for Relief and Development (HHRD)', password: 'password' },
            { username: 'HELVETAS Swiss Intercooperation (HELVETAS)', password: 'password' },
            { username: 'HOPE87', password: 'password' },
            { username: 'Human Appeal (HA)', password: 'password' },
            { username: 'International Medical Corps (IMC)', password: 'password' },
            { username: 'International Rescue Committee (IRC)', password: 'password' },
            { username: 'Islamic Relief (IR)', password: 'password' },
            { username: 'JEN', password: 'password' },
            { username: 'Jhpiego', password: 'password' },
            { username: 'Kokkyo naki Kodomotachi (KnK)', password: 'password' },
            { username: 'Malteser International (MI)', password: 'password' },
            { username: 'MdM', password: 'password' },
            { username: 'Mercy Corps', password: 'password' },
            { username: 'Muslim Aid', password: 'password' },
            { username: 'Muslim Hands', password: 'password' },
            { username: 'Norwegian Church Aid (NCA)', password: 'password' },
            { username: 'Oxfam', password: 'password' },
            { username: 'Qatar Charity (QC)', password: 'password' },
            { username: 'Relief International (RI)', password: 'password' },
            { username: 'Right To Play', password: 'password' },
            { username: 'Save the Children International (SCI)', password: 'password' },
            { username: 'Secours Islamique France (SIF)', password: 'password' },
            { username: 'SOLIDAR', password: 'password' },
            { username: 'Solidarites International (SI)', password: 'password' },
            { username: 'Tearfund', password: 'password' },
            { username: 'Triangle Génération Humanitaire', password: 'password' },
            { username: 'Voluntary Service Overseas (VSO)', password: 'password' },
            { username: 'WaterAid', password: 'password' },
            { username: 'Welthungerhilfe (WHH)', password: 'password' },
            { username: 'Norweign Rescuee comittee', password: 'password' }
        ];

        // Check and create users
        for (const user of users) {
            const userExists = await User.findOne({ username: user.username });
            if (!userExists) {
                await User.create(user);
                console.log(`✅ User ${user.username} created`);
            }
        }

    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    }
};
 
module.exports = connectDB;
