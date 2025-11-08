const { login, register } = useAuth()

const handleSubmit = (e) => {
  e.preventDefault()
  if (isLogin) {
    login({ email, password })
  } else {
    const name = e.target.name?.value
    register({ name, email, password })
  }
}