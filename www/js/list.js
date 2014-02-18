function updateBuckitList() {
            var output1 = "";
            var output2 = "";
            var total = 0;
            for (i = 0; i < buckit.list.length; ++i) {
                place = buckit.list[i]
                var output = " <li> " + place.name + ", " + Math.floor(place.rating * 10) + " Points" + ' <button class="remove" id="' + i + '">Remove</button> </li> ';
                if (place.visited) {
                    output2 += output;
                    total += Math.floor(place.rating * 10);
                } else {
                    output1 += output;
                }
               /* f = function(idx) {
                    console.log(idx);
                    if (confirm("Delete '" + buckit.list[idx].name + "' from the list?")) {
                        buckit.remove(buckit.list[idx]);
                        updateList();
                    }
                }
                $(".remove#" + i).click(_.partial(f, i));*/
            }
            $("#visit").html(output1);
            $("#visited").html(output2);
            $("#total-score").html(total);
            for (i = 0; i < buckit.list.length; ++i) {
                f = function(idx) {
                    console.log(idx);
                    if (confirm("Delete '" + buckit.list[idx].name + "' from the list?")) {
                        buckit.remove(buckit.list[idx]);
                        updateBuckitList();
                    }
                }
                $(".remove#" + i).click(_.partial(f, i));
            }
        }
        $(document).ready(function() {
            updateBuckitList();
        });
        //currentPosition.coords.longitude = buckit.list[0].geometry.location.lng
        //currentPosition.coords.latitude = buckit.list[0].geometry.location.lat