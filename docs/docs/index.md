# Txlog Architecture Overview

I've designed Txlog around two main parts that work together to keep your
package transactions organized. Have you ever wondered where all those DNF logs
actually go? Well, that's exactly what we're solving here.

## Server Version

The server is the brain of the operation. It manages our PostgreSQL database and
acts as a central hub for all the data coming in from across your network. I've
built it to handle multiple agent instances at once without breaking a sweat,
ensuring every piece of transaction data finds its home.

If you're ready to get things running, you should check out the [Server
Installation and Configuration](server/index.md) guide.

## Agent Version

On the other side, we have the agent. It's a lightweight little piece of
software that lives on your RHEL-compatible workstations. Its job is simple:
keep an eye on DNF, grab the transaction data, and send it over to the server
securely. We've made sure it doesn't get in the way of your actual work while it
does its thing.

You can find all the details on setting it up in the [Agent Installation and
Configuration](agent/index.md) section.

## Data Flow

So, how does the data actually travel? It's a pretty straightforward process,
really.

1. First, the Txlog agent keeps a close watch on DNF activities on your
   workstations. It catches every transaction the moment it happens.
2. We then take that transaction metadata and break it down into a structured
   format—package names, versions, timestamps, you name it.
3. Next, the agent encrypts that data and sends it over the network using secure
   protocols. We wouldn't want that info floating around in the clear, would we?
4. Finally, the server takes that incoming data, validates it, and tucks it away
   safely in the PostgreSQL database for whenever you need to audit it.

## Disclaimer

* Logbook icon created by
  [smashingstocks](https://www.flaticon.com/authors/smashingstocks), available
  on [Flaticon](https://www.flaticon.com/free-icons/logbook).
* PostgreSQL is a trademark of The PostgreSQL Global Development Group.
* RPM, DNF and RHEL are trademarks of Red Hat, Inc., registered in the United
  States and other countries.
* Linux is a registered trademark of Linus Torvalds in the U.S. and other
  countries.
* All other trademarks are the property of their respective owners.
