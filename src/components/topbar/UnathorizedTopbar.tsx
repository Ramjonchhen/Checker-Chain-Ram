import { Button } from "components/button"
import Link from "next/link"
import { useRouter } from "next/router"
import { useWalletDialogStore } from "stores"

// unused

export const UnauthorizedTopbar = () => {
  const router = useRouter()
  const { setLoginDialog } = useWalletDialogStore((state) => state)

  return (
    <div className="bg-white w-screen">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container flex justify-between items-center w-screen">
          <div>
            <Link href="/" passHref>
              <img src="/logo.svg" width={200} className="navbar__icon" />
            </Link>
          </div>
          <div
            className="collapse navbar-collapse flex justify-end"
            id="navbarNav"
          >
            <ul className="navbar-nav flex gap-x-4 md:gap-x-10  ms-auto">
              {[
                {
                  path: "/",
                  name: "Home"
                },
                {
                  path: "/liquidity",
                  name: "Liquidity"
                },
                {
                  path: "/staking",
                  name: "Staking"
                }
              ].map((route) => (
                <li
                  key={route.path}
                  className={`grid place-content-center ${
                    router.pathname === route.path
                      ? "text-primary"
                      : "text-content-primary"
                  }`}
                >
                  <Link href={route.path} passHref>
                    {route.name}
                  </Link>
                </li>
              ))}

              <li className="nav-item">
                <div className="navbar__button">
                  <Button
                    type="button"
                    onClick={() => {
                      setLoginDialog(true)
                    }}
                    title="Connect Wallet"
                  ></Button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  )
}
