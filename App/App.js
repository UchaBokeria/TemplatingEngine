export default class App {

    constructor() {

    }

    name = "Ucha";
    title = "Hello";
    
    list = [
        1, 2, 3, 4, 5
    ];   

    listObject = [
        {
            id:1,
            name:"joe",
            number:"+995574901924"
        },
        {
            id:2,
            name:"moe",
            number:"+995574123512"
        },
        {
            id:3,
            name:"luke",
            number:"+995573921944"
        }
    ];

    changeName = ()=> {
        this.name = (this.name == "Ucha") ? "tdg" : "Ucha";
        console.log(this.name);
        alert("name changed");
    }

}