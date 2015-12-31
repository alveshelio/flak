Comments = new Mongo.Collection('comments');

if (Meteor.isClient) {
    Template.CommentList.helpers({
        comments: function() {
            return Comments.find();
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

}
