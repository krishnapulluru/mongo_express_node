class APIFeatures{
    constructor(query , queryString){
      this.query = query;
      this.queryString = queryString
    }
  
    filtering(){
       const excludeParams = ['page' , 'sort' , 'limit' , 'fields'];
       let queryStr = {...this.queryString};
       excludeParams.forEach(el=>delete queryStr[el])
       queryStr = JSON.parse(JSON.stringify(queryStr).replace(/\b(lte|gte|gt|lt)\b/g, match=> `$${match}`))
       this.query = this.query.find(queryStr)
       return this
    }
  
    sorting(){
      if(this.queryString.sort){
        const sortString = this.queryString.sort.split(",").join(" ")
        this.query = this.query.sort(sortString)
      } else {
        this.query = this.query.sort("-createdAt")
      }
      return this;
    }
  
    fieldsLimiting(){
      if(this.queryString.fields){
        const fieldString = this.queryString.fields.split(",").join(" ");
        this.query = this.query.select(fieldString)
      } else {
        this.query = this.query.select("-__v")
      }
      return this;
    }
  
    paginate(){
      const page = this.queryString.page * 1 || 1;
      const pageLimit = this.queryString.limit *1 || 100;
      const skip = (page-1) * pageLimit;
      this.query = this.query.skip(skip).limit(pageLimit);
      return this;
    }
  
  }
  
  module.exports = APIFeatures;