///script.js
class WSG{
    constructor(){
        this.wordEntry = ko.observable();
        this.title = ko.observable();
        this.words = ko.observableArray();
        this.pretty = ko.observable(false);
        this.height = 15;
        this.width = 25;
        let _grid = [];
        for(let x = 0; x < this.height;x++){
            _grid.push([])
            for(let y = 0; y < this.width;y++)
                _grid[x][y] = ko.observable('!');//String.fromCharCode(65+Math.trunc(26*Math.random(1)))
        }
        this.grid= _grid;
    }
    InitGrid(){
        let _grid = this.grid;
        for(let x = 0; x < this.height;x++){
            for(let y = 0; y < this.width;y++)
                _grid[x][y]('!');//String.fromCharCode(65+Math.trunc(26*Math.random(1)))
        }
    }
    WordEntrySubmit(){
        console.log("Py!")
        let str = this.wordEntry()
        this.words.removeAll()
        let wrdArr = str.split("\n")
        wrdArr.sort(function(n,m){
            return n.length == m.length ? 0 : n.length < m.length ? -1 : 1
        })
        for(let i =0;i<wrdArr.length;i++)
            this.words.push(wrdArr[i].toLowerCase())
        let words2Place = this.words();
        let placedWords = [];
        let cnt = 0;
        this.InitGrid()
        for(let ptr = words2Place.length-1; 0 < words2Place.length 
            && cnt < 100*this.words().length;){
                cnt++;
                if(this.PlaceWord(words2Place[ptr])){
                    placedWords.push(words2Place.pop())
                    ptr = words2Place.length-1;
                    //console.log("moving to "+ptr)
                }
        }
        if(words2Place.length == 0){
            this.FillPuzzle(null,true)
        }
        //console.log(pos)
    }
    GetStart(){
        return {
            row:Math.floor(this.height*Math.random()),
            col:Math.floor(this.width*Math.random())
        }
    }
    GetDir(){
        return Math.ceil(Math.random()*4)
    }
    PlaceWord(wrd){
        let on = false;
        let tries = 10;
        let triesx = 5;
        do{
            let pos = this.GetStart();
            do{            
                let dir = this.GetDir();            
                //console.log(pos,dir,tries) 
                let grid = this.CopyGrid(this.grid)           
                on = this.WriteWord(wrd,grid,pos,dir,false)
                if(!on)
                    this.WriteWord(wrd,this.grid,pos,dir,true)
                tries--;
            }while(on && tries > 0)
            triesx--;
        }while(on && triesx > 0 )
        if(tries == 0)
            return false;
        else
            return true;
    }
    CopyGrid(grid){
        var ng = new Array(grid.length);
        for(let i = 0; i < ng.length;i++){
            ng[i] = new Array(grid[i].length)
            for(let j = 0; j < grid[i].length;j++)
                ng[i][j] = grid[i][j]()
        }
        return ng
    }
    WriteWord(wrd,grid,pos,dir,obs){
        let a = pos.row;
        let b = pos.col;
        let height = grid.length;
        let width = grid[0].length;
        for(let i=0;i< wrd.length;i++){
            if(a < height && b < width && a >= 0){
                if((obs?grid[a][b]():grid[a][b]) == '!' || (obs?grid[a][b]():grid[a][b]) == wrd[i]){
                    if(obs)
                        grid[a][b](wrd[i]);
                    else
                    grid[a][b] = wrd[i];
                    //console.log("placing",wrd[i],a,b)
                    if(i+1 == wrd.length){
                        return false;
                        //return true;
                    }
                    //get next position
                    switch(dir){
                        case 1: //horizontal
                            b = b+1; //a = a;
                            break;
                        case 2: //vertical
                            a = a+1;//b = b;
                            break;
                        case 3: //south-east
                            a= a+1;
                            b = b+1;
                            break;
                        case 4: //north-east
                            a = a - 1;
                            b= b+1;
                    }
                }else{
                    return true;
                    //break;
                }
            }else{
                return true;
                //break;
            }
        }
        return true
    }
    FillPuzzle(dt,o){
        //console.log(dt,o)
        if(dt instanceof WSG){
            o = false
        }
        for(let x = 0; x < this.height;x++){
            for(let y = 0; y < this.width;y++){
                if(this.grid[x][y]() == (o?'!':'_')) // ko.observable('!');//
                    this.grid[x][y](o?'_':String.fromCharCode(65+Math.trunc(26*Math.random(1))))//
                else if(!o)
                    this.grid[x][y](this.grid[x][y]().toUpperCase())
            }
        }
        if(!o){
            this.pretty(!this.pretty())
        }
    }
}



document.onreadystatechange = function(e){
    if(document.readyState == 'complete'){
        let vm = new WSG()
        ko.applyBindings(vm);
    }
}