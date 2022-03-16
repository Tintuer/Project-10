import { Component } from 'react';
import MyNavbar from './Components/MyNavbar.js';
import MyCard from './Components/Card.js';
import { Row, Col } from 'react-bootstrap';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: true,
      cart: [],
      filter: null,
      search: ""
    }
    this.handleChange = this.handleChange.bind(this)
  }

  changefilter = (cat) => {
    this.setState({ filter: cat })
    if (localStorage.getItem('filter') != null) {
      localStorage.setItem("filter", (cat))
    }
    else {
      localStorage.setItem("filter", "")
    }
  }

  addItem = (item) => {

    this.setState({
      cart: [...this.state.cart, item]
    }, () => localStorage.setItem('cart', JSON.stringify(this.state.cart)))

  }

  removeArticle = (articleToRemove) => {
    let index = this.state.cart.findIndex(item => item.id === articleToRemove.id)
    const tempCart = [...this.state.cart]
    if (index >= 0) {
      tempCart.splice(index, 1)
      this.setState({
        cart: [...tempCart]
      }, () => localStorage.setItem('cart', JSON.stringify(this.state.cart)))
    }
  }

  handleChange(e) {
    e.preventDefault()
    let name = e.target.name
    this.setState({
      [name]: e.target.value
    })
  }


  async componentDidMount() {
    const response = await fetch('http://localhost:1337/api/articles?populate=*', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    const articles = await response.json()
    this.setState({ articles: articles })

    if (localStorage.getItem('cart') != null) {
      this.setState({
        cart: JSON.parse(localStorage.getItem('cart'))
      })
    }
    else {
      this.setState({
        cart: []
      })
    }
  }

  render() {
    console.log(this.state.articles);
    return (
      <>
        <MyNavbar changefilter={this.changefilter} cart={this.state.cart} handleChange={this.handleChange} search={this.state.search} removeArticle={this.removeArticle} />

        <Row>
          {this.state.articles.data && this.state.articles.data
            .filter(article => article.attributes.name.toLowerCase().includes(this.state.search.toLowerCase()))
            .map((articles, key) =>
              <Col md={3}>
                <MyCard articles={this.state.articles} cart={this.state.cart} addItem={this.addItem} article={articles} key={key} />
              </Col>)}
        </Row>
      </>
    );
  }
}

export default App;


