Comments = new Mongo.Collection('comments');

if (Meteor.isClient) {

    Meteor.subscribe('allComments');

    // Method simulation
    //Meteor.methods({
    //    callMe: function() {
    //        console.log('client simulation');
    //    }
    //});

    // RPC calling function
    //Meteor.call('callMe', 'Helio', function(err, result) {
    //    if (err) throw err;
    //    console.log('result: ', result);
    //});

    // Defining a global Helper
    Template.registerHelper('get', function(key) {
        return Session.get(key);
    });

    //Template.UnderstandingSession.helpers({
    //    counter: function() {
    //        return Session.get('counter');
    //    }
    //});

    var counter = 0;
    setInterval(function() {
        Session.set('counter', ++counter);
    }, 1000);

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
    Comments.allow({
        insert: function (userId, doc) {
            return !!userId;
        },
        remove: function (userId, doc) {
            return false;
        },
        update: function (userId, doc) {
            return false;
        }
    });

    //RPC "Remote Procedural Call"
    //Meteor.methods({
    //    callMe: function(name) {
    //        return 'hello ' + name;
    //    }
    //});

    Meteor.publish('allComments', function() {
        if (this.userId){
            return Comments.find();
        } else {
            return this.ready();
        }
    });
}
