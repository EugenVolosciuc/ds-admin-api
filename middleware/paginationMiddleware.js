const errorHandler = require('../utils/errorHandler');

// Populated fields (array of fields of collection strings that should be populated)
module.exports.paginate = (model, populatedFields) => {
    return async (req, res, next) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const perPage = parseInt(req.query.perPage) || 15;
            const sortBy = JSON.parse(req.query.sortBy) || { createdAt: 'descending' };
            // const filters = req.query.filters || {};

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

            let queryResults = model.find().sort(sortBy).limit(perPage).skip(startIndex);
            if (Array.isArray(populatedFields)) queryResults = queryResults.populate(populatedFields);

            queryResults = await queryResults.exec();
            results[model.collection.collectionName] = queryResults;

            const totalItems = await model.estimatedDocumentCount();
            const totalPages = Math.ceil(totalItems / perPage);

            results.totalItems = totalItems;
            results.totalPages = totalPages;

            res.paginatedResults = results;
            next();
        } catch (err) {
            console.log(err)
            const { status, error } = errorHandler(err);
            res.status(status).json(error);
        }

    };
};