var app = angular.module('myApp', ['ng-admin']);

app.config(function (NgAdminConfigurationProvider) {
    var nga = NgAdminConfigurationProvider;
    var app = nga.application('ng-admin backend demo') // application main title
        .baseApiUrl('https://pimp-my-admin-backend-wilk.c9.io/api/'); // main API endpoint

    // define all entities at the top to allow references between them
    var post = nga.entity('posts') // the API endpoint for posts will be http://localhost:3000/posts/:id
        .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

    // set the application entities
    app.addEntity(post);
    
    function truncate(value) {
            if (!value) {
                return '';
            }

            return value.length > 50 ? value.substr(0, 50) + '...' : value;
        }

    // customize entities and views

    post.dashboardView() // customize the dashboard panel for this entity
        .title('Recent posts')
        .order(1) // display the post panel first in the dashboard
        .perPage(5) // limit the panel to the 5 latest posts
        .fields([nga.field('title').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

    post.listView()
        .title('All posts') // default title is "[Entity_name] list"
        .description('List of posts with infinite pagination') // description appears under the title
        .infinitePagination(true) // load pages as the user scrolls
        .fields([
            nga.field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
            nga.field('title'), // the default list field type is "string", and displays as a string
            nga.field('published_at', 'date'), // Date field type allows date formatting
            nga.field('views', 'number')
        ])
        .listActions(['show', 'edit', 'delete']);

    post.creationView()
        .fields([
            nga.field('title') // the default edit field type is "string", and displays as a text input
                .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
                .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
            nga.field('teaser', 'text'), // text field type translates to a textarea
            nga.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
            nga.field('published_at', 'date') // Date field type translates to a datepicker
        ]);

    post.editionView()
        .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
        .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
        .fields([
            post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
            nga.field('views', 'number')
                .cssClasses('col-sm-4')
        ]);

    post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
        .fields([
            nga.field('id'),
            post.editionView().fields(), // reuse fields from another view in another order
            nga.field('custom_action', 'template')
                .template('<other-page-link></other-link-link>')
        ]);
        
    post.deletionView()
        .fields([
            post.editionView().fields()
        ]);

    nga.configure(app);
});