Summary: Paquete de instalacion del Dashboard de DCA
Name: neoidas-nitro-components
Version: 1.0
Release: eridani.release.rhel5.5
License: GPL3
Group: M2M
URL: https://barricada.hi.inet/trac/IDAS/wiki
Source0: %{name}-%{version}.tar.gz
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root
Prefix: %{_dcadir}

%description
This RPM installs NEOIDAS nitro-components in your system

%prep
%setup -q

%build

%install
# Check dir existence
rm -rf $RPM_BUILD_ROOT
if [ ! -d $RPM_BUILD_ROOT%{_dcadir} ]
then
   mkdir -p $RPM_BUILD_ROOT%{_dcadir}
fi

cp -rf ${WORKSPACE}/* $RPM_BUILD_ROOT%{_dcadir}/
rm -rf $RPM_BUILD_ROOT%{_dcadir}/node_modules
rm -rf $RPM_BUILD_ROOT%{_dcadir}/pack


# -------------------------------------------------------------------------------------------- #
# post-install section:
# -------------------------------------------------------------------------------------------- #
%post

echo 'neoidas-nitro-components has been installed!'

# -------------------------------------------------------------------------------------------- #
# post-uninstall section:
# -------------------------------------------------------------------------------------------- #
%postun

# Restart Apache
	
echo 'neoidas-nitro-components has been uninstalled!'

%clean
rm -rf $RPM_BUILD_ROOT

%files
%defattr(-,manager,idas,-)
# Specify application dir
%{_dcadir}

%changelog
* Wed Jun 22 2011  <develop@localhost.localdomain> - 
- Initial build.
