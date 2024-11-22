import { useEffect, useState } from "react";
import Parse from "../lib/parse";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {  ArrowLeftIcon,  } from '@heroicons/react/24/outline';
import { FaEdit } from "react-icons/fa";

export default function profile() {
  const [events, setEvents] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
  });
  const router = useRouter();

  useEffect(() => {
    const currentUser = Parse.User.current();
    if (!currentUser) {
      router.push("/login");
    } else {
      const firstName = currentUser.get("firstName");
      const lastName = currentUser.get("lastName");
      const mail =currentUser.get("mail")

      setUserDetails({ firstName, lastName ,mail});

      fetchEvents();
      fetchInvitations();
    }
  }, []);

  const fetchEvents = async () => {
    const currentUser = Parse.User.current();
    const RoleAssignment = Parse.Object.extend("RoleAssignment");
    const roleQuery = new Parse.Query(RoleAssignment);
    roleQuery.equalTo("user", currentUser);
    roleQuery.include("event");
    try {
      const roleAssignments = await roleQuery.find();
      const associatedEvents = roleAssignments.map((assignment) =>
        assignment.get("event")
      );
      setEvents(associatedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchInvitations = async () => {
    const currentUser = Parse.User.current();
    const Invitation = Parse.Object.extend("Invitation");
    const invitationQuery = new Parse.Query(Invitation);
    invitationQuery.equalTo("user", currentUser);
    invitationQuery.equalTo("status", "Pending");
    invitationQuery.include(["event", "sender"]);

    try {
      const invitations = await invitationQuery.find();

      for (let invitation of invitations) {
        const sender = invitation.get("sender");
        if (sender) {
          await sender.fetch();
        }
      }

      setInvitations(invitations);
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleLogout = async () => {
    await Parse.User.logOut();
    router.push("/login");
  };

  const handleAcceptInvitation = async (invitation) => {
    try {
      const RoleAssignment = Parse.Object.extend("RoleAssignment");
      const roleAssignment = new RoleAssignment();
      roleAssignment.set("event", invitation.get("event"));
      roleAssignment.set("user", Parse.User.current());
      roleAssignment.set("role", invitation.get("role"));
      await roleAssignment.save();

      invitation.set("status", "Accepted");
      await invitation.save();

      fetchEvents();
      fetchInvitations();
    } catch (error) {
      console.error("Error accepting invitation:", error);
    }
  };

  const handleDeclineInvitation = async (invitation) => {
    try {
      invitation.set("status", "Declined");
      await invitation.save();
      fetchInvitations();
    } catch (error) {
      console.error("Error declining invitation:", error);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  return (
    <div className="">
      <div className="flex p-6 bg-[#20073b] justify-between items-center mb-6">
        <Image src="/logo-evotickets.png" width={200} height={200} alt="Logo" />

        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 text-white font-semibold"
          >
            <p>Edit </p>
            <FaEdit className="size-7" />
          </button>
        </div>
      </div>
      <div className="p-6">
        <div className="mb-6 w-60">
          <div className="flex justify-start items-center p-6 ">
            <Link
              className="flex  justify-center items-center space-x-2 mr-6"
              href="/dashboard"
            >
              <ArrowLeftIcon className="size-6 text-[#fe0980]" />
              <p>Retour</p>
            </Link>
            <h1 className="text-2xl"> {userDetails.firstName} {userDetails.lastName}{userDetails.mail} </h1>
          </div>
         
        </div>
      </div>
    </div>
  );
}
