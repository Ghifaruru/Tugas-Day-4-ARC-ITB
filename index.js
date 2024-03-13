const express = require ('express')
const app = express()
const fs = require('fs')

app.use(express.json())

//PATH UNTUK MENAMPILKAN SEMUA FILM : ('/')
//PATH UNTUK MENCARI BERDASARKAN ID : ('/:id')
//PATH UNTUK MENCARI BERDASARKAN NAME : ('/search/movie')
//PATH UNTUK MENAMBAH FILM : ('/')
//PATH UNTUK MELAKUKAN PERUBAHAN TERHADAP SEBUAH FILM : ('/:id')

const movies = JSON.parse(fs.readFileSync("movies.json"))
console.log(movies)

app.get('/', function(req,res,next){
    res.status(200).json ({
        status : "Sukses",
        jumlah: movies.length,
        movies:movies
    })
})

app.get('/:id', function(req,res,next){
    let id=req.params.id;
    console.log(id);
    let moviepilihan=movies.filter(x => (x.imdbID === id)||((x.Title === id)));

    if (moviepilihan==false) {
        return res.status(404).json({
            status : "Gagal",
            massage : "Movie tidak ditemukan"
        })
    }
    
    res.status(200).json({
        status : "Movie ditemukan",
        moviepilhan:moviepilihan
    })
})

app.get('/search/movie', (req, res,next) => {
    let searchTerm = req.query.name
    let filteredMovies = movies.filter(x =>
        (x.Title?.toLowerCase()?.includes(searchTerm?.toLowerCase()))
    );
    ;
    if (filteredMovies.length > 0) {
        res.send(filteredMovies);
    } else {
        res.status(404).send('No movies found');
    }
});

app.post('/', function(req,res,next){
    let newmovies = req.body;
    movies.push(newmovies);

    fs.writeFile("movies.json",JSON.stringify(movies), (error)=>{
        if (error) {console.log(error)}
        else {
            res.status(200).json({
                status :"Movie berhasil ditambah",
                movieyangditambah : newmovies
            })
        }
    })
})

app.put('/:id', function(req,res,next){
    let id = req.params.id
    let movieygbaru = req.body
    let movieygdiganti = movies.find(x=> x.imdbID===id)

    if (!movieygdiganti) {
        return res.status(404).json({
            status : "Gagal",
            massage : "Movie tidak ditemukan"
        })
    }

    let index = movies.indexOf(movieygdiganti)
    movies[index]=movieygbaru

    fs.writeFile("movies.json",JSON.stringify(movies), (error)=>{
        if (error) {console.log(error)}
        else {
            res.status(200).json({
                status :"Movie berhasil diganti",
                moviedigantimenjadi : movieygbaru 
            })
        }
    })
})
    
app.patch('/:id', function(req,res,next){
    let id = req.params.id;
    let movieygdiupdate = movies.find(x=> x.imdbID=== id);

    if (!movieygdiupdate) {
        return res.status(404).json({
            status : "Gagal",
            massage : "Movie tidak ditemukan"
        })
    }

    let index = movies.indexOf(movieygdiupdate);
    Object.assign(movieygdiupdate,req.body);
    movies[index]=movieygdiupdate;


    fs.writeFile("movies.json", JSON.stringify(movies), (error)=>{
        if (error) {console.log(error)}
        else {
            res.status(200).json({
                status : "Movie berhasil diUpdate",
                movieygdiupdate : movieygdiupdate
            })
        }
    })
})

app.delete('/:id', function(req,res,next){
    let id = req.params.id;
    let movieygdihapus = movies.find(x => x.imdbID===id);

    if (!movieygdihapus) {
        return res.status(404).json({
            status : "Gagal",
            massage : "Movie tidak ditemukan"
        })
    }

    let index = movies.indexOf(movieygdihapus);
    movies.splice(index,1);

    fs.writeFile("movies.json", JSON.stringify(movies), (error)=>{
        if (error) {console.log(error)}
        else {
            res.status(200).json({
                status : "Movie berhasil di hapus",
                movieygdihapus : movieygdihapus
            })
        }
    })
})

app.listen(3000,function(){
    console.log('Server berhasil dinyalakan')
})
