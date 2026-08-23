import { RouterProvider, createBrowserRouter } from "react-router";
import SearchResults from "./SearchResults";
import PropertyDetails from "./PropertyDetails";
import EmailVerification from "./EmailVerification";
import TenantExperience from "./TenantExperience";
import Login from "./Login";
import ListingWorkflow from "./ListingWorkflow";
import AdminExperience from "./AdminExperience";
import AddisAI from "./AddisAI";
import MessagingExperience from "./MessagingExperience";
import TrustSafety from "./TrustSafety";
import DesignSystem from "./DesignSystem";
import PrototypeHub from "./PrototypeHub";

const router = createBrowserRouter([
  { path: "/", Component: PropertyDetails },
  { path: "/search", Component: SearchResults },
  { path: "/auth/verify-email", Component: EmailVerification },
  { path: "/login", Component: Login },
  { path: "/tenant", Component: TenantExperience },
  { path: "/home", Component: TenantExperience },
  { path: "/landlord/listing", Component: ListingWorkflow },
  { path: "/admin", Component: AdminExperience },
  { path: "/ai", Component: AddisAI },
  { path: "/messages", Component: MessagingExperience },
  { path: "/trust-safety", Component: TrustSafety },
  { path: "/design-system", Component: DesignSystem },
  { path: "/prototype", Component: PrototypeHub },
]);
export default function App(){ return <RouterProvider router={router} />; }
