var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import mongoose from 'mongoose';
import connectMongoose from '../lib/mongoose-connect';
import Category from '../models/Category';
var categoriesToSeed = [
    { name: 'Web Development' },
    { name: 'Data Science' },
    { name: 'Mobile Development' },
    { name: 'Machine Learning' },
    { name: 'Artificial Intelligence' },
    { name: 'Cloud Computing' },
    { name: 'Cybersecurity' },
    { name: 'Game Development' },
    { name: 'Database Management' },
    { name: 'DevOps' },
    { name: 'Photography' },
    { name: 'Interior Decor' },
    { name: 'Beauty' },
    { name: 'UI/UX' },
    { name: 'Project Management' },
    { name: 'Cooking' },
    { name: 'Finance' },
    { name: 'Business' },
    { name: 'Children' },
    { name: 'Religion' },
];
function seedCategories() {
    return __awaiter(this, void 0, void 0, function () {
        var existingCategories, categories, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, 7, 9]);
                    // Verify MONGODB_URI
                    if (!process.env.MONGODB_URI) {
                        throw new Error('MONGODB_URI is not defined in .env');
                    }
                    console.log('MONGODB_URI:', process.env.MONGODB_URI);
                    // Connect to MongoDB
                    return [4 /*yield*/, connectMongoose()];
                case 1:
                    // Connect to MongoDB
                    _a.sent();
                    console.log('Connected to MongoDB');
                    return [4 /*yield*/, Category.find({}).lean()];
                case 2:
                    existingCategories = _a.sent();
                    console.log('Existing categories:', existingCategories);
                    // Clear existing categories (optional, comment out to append)
                    return [4 /*yield*/, Category.deleteMany({})];
                case 3:
                    // Clear existing categories (optional, comment out to append)
                    _a.sent();
                    console.log('Cleared existing categories');
                    // Insert new categories
                    return [4 /*yield*/, Category.insertMany(categoriesToSeed, { ordered: false })];
                case 4:
                    // Insert new categories
                    _a.sent();
                    console.log('Seeded categories:', categoriesToSeed);
                    return [4 /*yield*/, Category.find({}).lean()];
                case 5:
                    categories = _a.sent();
                    console.log('Current categories in database:', categories);
                    return [3 /*break*/, 9];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error seeding categories:', error_1);
                    throw error_1;
                case 7: 
                // Close the MongoDB connection
                return [4 /*yield*/, mongoose.connection.close()];
                case 8:
                    // Close the MongoDB connection
                    _a.sent();
                    console.log('MongoDB connection closed');
                    return [7 /*endfinally*/];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Run the seeding function
seedCategories()
    .then(function () {
    console.log('Seeding completed successfully');
    process.exit(0);
})
    .catch(function (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
});
