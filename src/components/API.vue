<script>
export default {
  log(username, password) {
    //here would be the HTTP POST to DB loggin
    return (
      (username === 'admin' && password === 'admin') || (username === 'user' && password === 'user')
    );
  }
}
</script>
