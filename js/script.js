
var $body = $('body');
var $wikiElem = $('#wikipedia-links');
var $nytHeaderElem = $('#nytimes-header');
var $nytElem = $('#nytimes-articles');
var $greeting = $('#greeting');

var streetStr;
var cityStr;
var address;

function loadData(event) {

    event.preventDefault();

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    streetStr = $('#street').val();
    cityStr = $('#city').val();
    address = streetStr + ', ' + cityStr;

    $greeting.text('So, you want to live at ' + address + '?');

    streetView();
    NYTimes();
    Wikipedia();
};

function streetView() {
    var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address + ' &key=AIzaSyDpX8jtCIAjYYY8Wj8XlgYh6L-mo0zaMCY';
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');
};

// load nytimes
function NYTimes() {
    var nytimesUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=ab07736ad38e47f8b481257ba25cb929';
    $.getJSON(nytimesUrl, function (data) {

        $nytHeaderElem.text('New York Times Articles About ' + cityStr);

        var articles;
        articles = data.response.docs;
        for (var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">' +
                    '<a href="' + article.web_url + '">' + article.headline.main + '</a>' +
                    '<p>' + article.snippet + '</p>' +
                    '</li>');
        };

    }).error(function (e) {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });
};

// load wikipedia data
function Wikipedia() {
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout(function () {
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        success: function (response) {
            var articleList = response[1];
            var articleStr;

            for (var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            }
            ;

            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);