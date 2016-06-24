$(document).ready(function () {
  $('[data-toggle="offcanvas"]').click(function () {
    $('.row-offcanvas').toggleClass('active')
  });
});

$("#ArtistName, #SongName, #AlbumName, #Genre, #Year").keyup(function(event){
    if(event.keyCode == 13){
        $("#SearchButton").click();
    }
});

var spotifyApi = new SpotifyWebApi();

var ArtistName = null;
var SongName = null;
var AlbumName = null;
var Genre = null;
var Year = null;
var SongActual = null;
var AlbumActual = null;
var ArtistActual = null;
var PageNumber = null;
var Offset = null;
var prevURL = null;
var nextURL = null;
var playsong = "";
var finalplaysong = "";
var ifcheck1;
var ifcheck2;

var NextElement = document.getElementById('next');
NextElement.onclick = NextClicked;
var PrevElement = document.getElementById('prev');
PrevElement.onclick = PrevClicked;
var SearchButton = document.getElementById('SearchButton');
SearchButton.onclick = Search;


function NextClicked() {
	NextElementClassName = NextElement.className.toString();
	NextElementDisabled = NextElementClassName.match("disabled");
	if(NextElementDisabled) {
		console.log("next is disabled");
	} else {
		var splitRes = nextURL.split("&");
		SearchString = splitRes[0].substring(splitRes[0].indexOf("=")+1);
		SearchString = decodeURIComponent(SearchString);
		Offset = splitRes[1].substring(splitRes[1].indexOf("=")+1);
		GetTracks(SearchString);
	}
}

function PrevClicked() {
	PrevElementClassName = PrevElement.className.toString();
	PrevElementDisabled = PrevElementClassName.match("disabled");
	if(PrevElementDisabled) {
		console.log("prev is disabled");
	} else {
		var splitRes = prevURL.split("&");
		SearchString = splitRes[0].substring(splitRes[0].indexOf("=")+1);
		SearchString = decodeURIComponent(SearchString);
		Offset = splitRes[1].substring(splitRes[1].indexOf("=")+1);
		GetTracks(SearchString);
	}
}

function btncalllike() {
	console.log("clicked like");
}

function btncalldislike() {
	console.log("clicked dislike");
}

function cleartextfields() {
	document.getElementById("ArtistName").value = "";
    document.getElementById("SongName").value = "";
    document.getElementById("AlbumName").value = "";
    document.getElementById("Genre").value = "";
    document.getElementById("Year").value = "";

}

function changecolor (element) {
	element.style.color = 'white';
}


function unhideme (divid) {
var item = document.getElementById(divid);
if (item) {
    if(item.className=='row hidden'){
        item.className = 'row unhidden';
    }
    if(item.className=='pager hidden'){
        item.style.display='block';
    }

}
}

function unhidesong (divid) {
var item = document.getElementById(divid);
if (item) {
	item.style.display='block';
}
}

function hideme (divid) {
var item = document.getElementById(divid);
if (item) {
	    item.style.display='none';
}
}

function Search()
{

	ArtistName = document.getElementById("ArtistName").value;
	SongName = document.getElementById("SongName").value;
	AlbumName = document.getElementById("AlbumName").value;
	Genre = document.getElementById("Genre").value;
	Year = document.getElementById("Year").value;
	Offset = 0;
	var SearchString = "";
	if(ArtistName) {
	  SearchString = SearchString + "artist:\"" + ArtistName + "\"+";
	}
	if(SongName) {
	  SearchString = SearchString + "track:\"" + SongName + "\"+";
	}
	if(AlbumName) {
	  SearchString = SearchString + "album:\"" + AlbumName + "\"+";
	}
	if(Genre) {
	  SearchString = SearchString + "genre:\"" + Genre + "\"+";
	}
	if(Year) {
	  SearchString = SearchString + "year:" + Year + "\"+";
	}

	//removing the last %20 from the search query
	SearchString = SearchString.slice(0, -1);

	GetTracks(SearchString);
	cleartextfields();
}

function GetTracks(SearchString) {
	unhideme('ShowResults'); hideme('ShowWelcomeText'); 
	// hideme('NoResults');
	console.log(SearchString);
	if(!Offset) {
	  Offset = 0;
	}
	spotifyApi.searchTracks(SearchString, {limit: 10, offset: Offset})
    .then(function(data) {
     console.log('Searching using the search string', data);
     result = data.tracks;
     total = result.total;
     prevURL = result.previous;
     nextURL = result.next;
     tracks = result.items;
     
     console.log("data:", data);
     console.log("result:", result);
     console.log("total:", total);
     console.log("prev:", prevURL);
     console.log("next:", nextURL);
     console.log("tracks:", tracks);
     
     if(prevURL) {
     	document.getElementById("prev").className = "previous";
     } else {
     	document.getElementById("prev").className = "previous disabled";
     }
     
     if(nextURL) {
     	document.getElementById("next").className = "next";
     } else {
     	document.getElementById("next").className = "next disabled";
     }
     
     //adding values to display headings
     playsong = "https://embed.spotify.com/?uri=";
     for(i = 0; i < tracks.length; i++) {
     	document.getElementById("h2" + (i+1)).innerHTML = tracks[i].name;
     	document.getElementById("p" + (i+1)).innerHTML = tracks[i].name;
	    finalplaysong = playsong + tracks[i].uri;
	    document.getElementById("i" + (i+1)).src = finalplaysong;
	    unhidesong("i" + (i+1));
     }
     for(; i < 10; i++) {
     	document.getElementById("h2" + (i+1)).innerHTML = null;
     	document.getElementById("p" + (i+1)).innerHTML = null;
     	hideme("i" + (i+1));
	    document.getElementById("i" + (i+1)).src = null;
     }

  }, function(err) {
    console.error(err);
  });
}