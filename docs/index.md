---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  text: "Because RPMs have stories to tell"
  tagline: Our system tracks package transactions on RPM-based systems, compiling data on the number of updates and installations.
  image:
    src: /images/logbook.png
    alt: The Logbook
  actions:
    - theme: brand
      text: Quickstart
      link: /docs

features:
  - icon:
      src: /images/transaction-tracking.svg
    title: Comprehensive Transaction Tracking
    details: The system meticulously records all package transactions, including installations, updates, and removals, providing a complete history of package activity on the system.
  - icon:
      src: /images/data-compilation.svg
    title: Detailed Data Compilation
    details: Beyond simple counts, the system compiles comprehensive data on updates and installations, such as frequency, package names, versions, and potentially even dependencies.
  - icon:
      src: /images/server-restart.svg
    title: Track server restarts
    details: Track when your system requires a reboot to fully apply critical security updates. This is essential because some system updates, particularly those affecting the kernel or core libraries, only take effect after a system restart to ensure system stability and security.
  - icon:
      src: /images/rpm-package.svg
    title: RPM System Focus
    details: The system specializes in tracking packages on RPM-based systems, ensuring compatibility and accurate data collection for distributions like AlmaLinux, Fedora, and Red Hat Enterprise Linux.
---
