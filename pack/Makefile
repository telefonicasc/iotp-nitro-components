all: skeleton nitro-components
skeleton:
	mkdir -p ../src/dist
	mkdir -p SOURCES/neoidas-nitro-components-1.0
	mkdir -p BUILD
	mkdir -p /var/tmp/RPMS/NITROCOMPONENTS
	mkdir -p RPMS 
	mkdir -p SRPMS 
nitro-components:
	-cd SOURCES &&tar -cv -f  neoidas-nitro-components-1.0.tar --exclude .svn  neoidas-nitro-components-1.0&&gzip -f neoidas-nitro-components-1.0.tar
	rpmbuild -ba --define "_topdir ${PWD}" --buildroot /var/tmp/RPMS/NITROCOMPONENTS/${DATE}  SPECS/neoidas-nitro-components.spec; if [ $$? -ne 0 ]; then rm -rf  /var/tmp/RPMS/NITROCOMPONENTS/${DATE}; exit 6; fi
	rm -rf  /var/tmp/RPMS/NITROCOMPONENTS/${DATE}

