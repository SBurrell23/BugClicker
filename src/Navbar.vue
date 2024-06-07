<template>
    <header>
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
            <div className="container">
                <a className="navbar-brand" href="/">
                <i className="fa fa-bugs"></i>
                    &nbsp;Bug Clicker
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarCollapse">
                    <ul className="nav navbar-nav mb-2 mb-md-0">
                        <li className="nav-item">
                            <a className="nav-link" href="/">Buy Merch</a>
                        </li>
                        {/* <li className="nav-item ">
                            <a className="nav-link" href="/">Bugs!</a>
                        </li> */}
                    </ul>
                </div>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style scoped>
.greeting {
  font-size: 2em;
  text-align: center;
}
</style>