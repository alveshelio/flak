Comments = new Mongo.Collection('comments');

if (Meteor.isClient) {

    Meteor.subscribe('allComments');

    // Method simulation
    Meteor.methods({
        callMe: function() {
            console.log('client simulation');
        }
    });

    // RPC calling function
    Meteor.call('callMe', 'Helio', function(err, result) {
        if (err) throw err;
        console.log('result: ', result);
    });

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

    //RPC "Remote Procedural Call"
    Meteor.methods({
        callMe: function(name) {
            return 'hello ' + name;
        }
    });

    Meteor.publish('allComments', function() {
        var cursor = Comments.find();
        var self = this;
        var handle = cursor.observeChanges({
            added: function(id, fields) {
                self.added('comments', id, fields);
            },
            changed: function(id, fields) {
                self.changed('comments', id, fields);
            },
            removed: function(id) {
                self.removed('comments', id);
            }
        });

        this.ready();

        // stop observing
        this.onStop(function() {
            handle.stop();
        })
    });

}
