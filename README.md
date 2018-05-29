Guide to Endpoints:

LinkList / Database simultaneous updates

Main Endpoints:

Get first item in deck:
    GET: /api/start-session/:id
        Requires
            { deckId } in req.params; (!not body!)

Submit answer and get next question in deck:
    POST: /api/update-session/:id
        Requires
            { deckId } in req.params; 
            { correct } in req.body;

Add items
    POST: /api/add-item
        Requires
            { deckId, question, answer} in req.body

Delete items
    DELETE: /api/delete-item   
        Requires (!notice this is a DELETE req that needs a body and not params!)
            { deckId, questionId } in req.body

Edit items 
    PUT: /api/edit-item
        Requires
            { deckId, questionId, question, answer } in req.body



Other Endpoints:

    POST: /api/new
        (No body required)
        Will compile a new deck with all questions in the database. For test purposes only.

    To be continued...
    There are numerous other endpoints for CRUD operations for users, questions and decks.