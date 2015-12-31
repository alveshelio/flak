Comments = new Mongo.Collection('comments');

if (Meteor.isClient) {
    Meteor.subscribe('comments', function() {
        console.log('holly smokes it\'s ready');
    });
    Meteor.subscribe('recentComments');

    Template.CommentList.helpers({
        comments: function() {
            return Comments.find();
        },
        // Parameter timestamp is being passed from the template
        // which in turn is being passed by Comments.insert({});
        formatTimestamp: function(timestamp) {
            return moment(timestamp).calendar();
        }
    });



    Template.CommentAdd.events({
        'submit form': function(e, tmpl) {
            e.preventDefault();
            var formEl = tmpl.find('form');
            var commentEl = tmpl.find('[name=comment]');
            var comment = commentEl.value;

            Comments.insert({
                login: 'helioalves',
                timestamp: new Date(),
                room: 'main',
                comment: comment
            });

            formEl.reset();
        }
    });

}

if (Meteor.isServer) {
    Meteor.publish('comments', function() {

        this.added('comments', 'a', {comment: 'comment from the publishing function'});
        this.added('comments', 'b', {comment: 'publishing func comment'});
        this.added('comments', 'c', {comment: 'another comment from the publishing function'});
        this.ready();
    });

    Meteor.publish('recentComments', function() {
        this.added('comments', 'a', {comment: 'New comment from the publishing function on id a'});
    });

}
