const { ErrorHandler } = require('../utils/errorHandler');

// Populated fields (array of fields of collection strings that should be populated)
module.exports.paginate = (model, populatedFields) => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 15;
            const sortBy = req.query.sortBy ? JSON.parse(req.query.sortBy) : { createdAt: 'descending' };
            const filters = req.query.filters ? JSON.parse(req.query.filters) : {};

            const startIndex = (page - 1) * perPage;
            const endIndex = page * perPage;

            const results = {
                page,
                perPage
            };

            if (endIndex < model.length) {
                results.next = {
                    page: page + 1,
                    perPage
                };
            };

            if (startIndex > 0) {
                results.previous = {
                    page: page - 1,
                    perPage
                };
            };

            let query = model.find(filters).sort(sortBy).limit(perPage).skip(startIndex);

            if (Array.isArray(populatedFields)) {
                query = query.populate(populatedFields);
            }

            const queryResults = await query.exec();

            results[model.collection.collectionName] = queryResults;

            const totalItems = await model.find(filters).countDocuments();
            const totalPages = Math.ceil(totalItems / perPage);

            results.totalItems = totalItems;
            results.totalPages = totalPages;

            res.paginatedResults = results;
            next();
        } catch (error) {
            throw new ErrorHandler(error.status, error.message, error);
        }
    };
};